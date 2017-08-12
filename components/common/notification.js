import { getDatabase } from './database';
/*
userIdSent: es el usuario que envia la Notificaciones
userIdGet: es el Id del usuario que recibe la notificacion
userGet: es el objeto usuario (guarada el nickname, nombre, foto, etc)
type: tipo de Notificacion
date: fecha en que se mando
 */

export const createNotification = (userIdSent, userIdGet,userGet,type,date) => {
  getDatabase().ref('notifications/' + userSendId).push({
    status: false,
    type: type,
    userIdGet: userIdGet,
    userGet: userGet,
    date: date
  });
}
