const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
admin.initializeApp();

exports.restarUnDia = functions.pubsub
  .schedule("every day 00:00")
  .onRun(async (context) => {
    const db = admin.firestore();

    // Obtenemos todas las temáticas
    const tematicasRef = db.collection("Tematicas");
    const tematicasSnap = await tematicasRef.get();
    const tematicasDocs = tematicasSnap.docs;

    // Obtenemos también todos los usuarios para reiniciar sus votos cuando toque
    const usuariosRef = db.collection("Usuarios");
    const usuariosSnap = await usuariosRef.get();
    const usuariosDocs = usuariosSnap.docs;

    const promises = [];

    // Iteramos cada temática
    for (let i = 0; i < tematicasDocs.length; i++) {
      const doc = tematicasDocs[i];
      const data = doc.data();

      if (data.Seleccionado === "Si" || data.Seleccionado === "AG") {
        const newDuracion = data.Duracion - 1;
        promises.push(doc.ref.update({ Duracion: newDuracion }));

        // Cuando la duración baja de 0 (pero no de -3), pasa a "AG" y elegimos nueva temática
        if (newDuracion < 0 && newDuracion > -3) {
          promises.push(doc.ref.update({ Seleccionado: "AG" }));

          // Elegimos aleatoriamente otra temática distinta
          const otrosDocs = tematicasDocs.filter((_, index) => index !== i);
          if (otrosDocs.length > 0) {
            const randomDoc =
              otrosDocs[Math.floor(Math.random() * otrosDocs.length)];

            // Marcamos la nueva temática como seleccionada y con duración 20
            promises.push(
              randomDoc.ref.update({
                Seleccionado: "Si",
                Duracion: 20,
              })
            );

            // Reiniciamos los votos de todos los usuarios a 20
            usuariosDocs.forEach((userDoc) => {
              promises.push(userDoc.ref.update({ Votos: 20 }));
            });
          }
        } else if (newDuracion <= -3) {
          // Si baja de -3 dejamos la temática en "No"
          promises.push(doc.ref.update({ Seleccionado: "No" }));
        }
      }
    }

    // Ejecutamos todas las actualizaciones en paralelo
    await Promise.all(promises);

    return null;
  });
