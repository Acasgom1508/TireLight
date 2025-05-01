const functions = require("firebase-functions/v1");
const admin = require('firebase-admin');
admin.initializeApp();

exports.restarUnDia = functions.pubsub.schedule('every day 00:00').onRun(async (context) => {
  const tematicasRef = admin.firestore().collection('Tematicas');
  const snapshot = await tematicasRef.get();

  const promises = snapshot.docs.map(async (doc) => {
    const data = doc.data();
    if (data.Duracion > -3) {
      await doc.ref.update({ Duracion: data.Duracion - 1 });
    }
  });

  await Promise.all(promises);

  console.log('Duracion actualizada (una vez al día)');
  return null;
});
