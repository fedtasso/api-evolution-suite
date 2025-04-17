// ----------------------------------- filtros ------------------------------------
// --------------------------------------------------------------------------------
export const buscarNombre = (nombre, usuarios) => {   //TO DO contemplar errores de escritura en la busqueda
    let usuario = usuarios.filter(user => user.nombre.includes(nombre));
    return usuario.length ? usuario : null;
}
