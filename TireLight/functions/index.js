const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
admin.initializeApp();

exports.restarUnDia = functions.pubsub
  .schedule("every day 00:00")
  .onRun(async (context) => {
    const db = admin.firestore();

    const tematicasRef = db.collection("Tematicas");
    const tematicasSnap = await tematicasRef.get();
    const tematicasDocs = tematicasSnap.docs;

    const usuariosRef = db.collection("Usuarios");
    const usuariosSnap = await usuariosRef.get();
    const usuariosDocs = usuariosSnap.docs;

    const promises = [];

    for (let i = 0; i < tematicasDocs.length; i++) {
      const doc = tematicasDocs[i];
      const data = doc.data();

      if (data.Seleccionado === "Si" || data.Seleccionado === "AG") {
        const newDuracion = data.Duracion - 1;
        promises.push(doc.ref.update({ Duracion: newDuracion }));

        if (newDuracion < 0 && newDuracion > -3) {
          // 1. Buscar la foto con más votos de esta temática
          const fotosSnap = await db
            .collection("Fotos")
            .where("Tematica", "==", data.Nombre)
            .orderBy("Votos", "desc")
            .limit(1)
            .get();

          if (!fotosSnap.empty) {
            const fotoGanadora = fotosSnap.docs[0];
            promises.push(fotoGanadora.ref.update({ Estado: "Ganadora" }));
          }

          // 2. Cambiar estado de temática a AG
          promises.push(doc.ref.update({ Seleccionado: "AG" }));

          // 3. Elegir nueva temática
          const otrosDocs = tematicasDocs.filter((_, index) => index !== i);
          if (otrosDocs.length > 0) {
            const randomDoc =
              otrosDocs[Math.floor(Math.random() * otrosDocs.length)];

            promises.push(
              randomDoc.ref.update({
                Seleccionado: "Si",
                Duracion: 20,
              })
            );

            // 4. Reiniciar votos
            usuariosDocs.forEach((userDoc) => {
              promises.push(userDoc.ref.update({ Votos: 20 }));
            });
          }
        } else if (newDuracion <= -3) {
          promises.push(doc.ref.update({ Seleccionado: "No" }));
        }
      }
    }

    await Promise.all(promises);
    return null;
  });
