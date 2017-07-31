import { getDatabase } from './database';
/*
userSend: es el usuario que envia la Notificaciones
userIdGet: es el usuario que recibe la notificacion
type: tipo de Notificacion
date: fecha en que se mando
 */

export const createNotification = (userIdGet,userSend,type,date) => {
  getDatabase().ref('notifications/' + userIdGet).push({
    status: false,
    type: userSend,
    userSendId: type,
    userSendNickName: date,
    date: userIdGet
  });
}
