const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
admin.initializeApp();

exports.restarUnDia = functions.pubsub
  .schedule("every day 00:00")
  .onRun(async (context) => {
    const tematicasRef = admin.firestore().collection("Tematicas");
    const snapshot = await tematicasRef.get();

    const docs = snapshot.docs;
    const promises = [];

    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      const data = doc.data();

      if (data.Seleccionado === "Si" || data.Seleccionado === "AG") {
        const newDuracion = data.Duracion - 1;
        promises.push(doc.ref.update({ Duracion: newDuracion }));

        if (newDuracion < 0 && newDuracion > -3) {
          promises.push(doc.ref.update({ Seleccionado: "AG" }));

          // Elegir un documento aleatorio distinto al actual
          const otrosDocs = docs.filter((_, index) => index !== i);
          if (otrosDocs.length > 0) {
            const randomDoc = otrosDocs[Math.floor(Math.random() * otrosDocs.length)];
            promises.push(randomDoc.ref.update({
              Seleccionado: "Si",
              Duracion: 20
            }));
          }
        } else if (newDuracion <= -3) {
          promises.push(doc.ref.update({ Seleccionado: "No" }));
        }
      }
    }

    await Promise.all(promises);

    console.log("Duracion actualizada (una vez al día)");
    return null;
  });
