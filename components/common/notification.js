import { getDatabase } from './database';
/*
userIdSent: es el usuario que envia la Notificaciones, es decir el que esta logeado
userIdGet: es el Id del usuario que recibe la notificacion
type: tipo de Notificacion "invitation o follow"
date: fecha en que se mando
diaryName: Nombre del diario q se le invita si es necesario
diaryId: El ID del diario al que se le invita, si es necesario
 */

export const createNotification = (userIdSent, userIdGet , type, date, diaryId, diaryName) => {
  console.log(userIdSent, userIdGet , type, date);
  getDatabase().ref('notifications/' + userIdSent).push({
    status: false,
    type: type,
    userIdGet: userIdGet,
    diaryId: diaryId,
    diaryName: diaryName,
    date: date
  });
}
