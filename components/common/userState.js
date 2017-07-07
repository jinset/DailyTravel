var uid;

export const setUser = (userId) => {
    uid = userId;
    alert("Usuario Conectado: " + uid)
}

export const getUser = () => {
    return uid;
}

//"12345!@12345.com"
