<template>
  <div class="user-container">
    <h1>Gestión de Usuarios</h1>

    <!-- 🔹 Botón de cierre de sesión -->
      <button class="logout" @click="cerrarSesion">🚪 Cerrar sesión</button>
    <!-- 🔹 Formulario de creación / edición -->
    <form @submit.prevent="guardarUsuario">
      <h3>{{ editando ? 'Editar Usuario' : 'Registrar Usuario' }}</h3>
      <input v-model="form.nombre" type="text" placeholder="Nombre" required />
      <input v-model="form.correo" type="email" placeholder="Correo" required />
      <input
        v-if="!editando"
        v-model="form.password"
        type="password"
        placeholder="Contraseña"
        required
      />
      <button type="submit">
        {{ editando ? 'Actualizar' : 'Registrar' }}
      </button>
      <button
        v-if="editando"
        type="button"
        class="cancelar"
        @click="cancelarEdicion"
      >
        Cancelar
      </button>
    </form>

    <hr />

    <!-- 🔹 Tabla de usuarios -->
    <h2>Lista de usuarios</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in usuarios" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.nombre }}</td>
          <td>{{ user.correo }}</td>
          <td>
            <button class="editar" @click="editarUsuario(user)">✏️ Editar</button>
            <button class="eliminar" @click="eliminarUsuario(user.id)">🗑️ Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const usuarios = ref([]);
const form = ref({ id: null, nombre: '', correo: '', password: '', rol: 'user' });
const editando = ref(false);

const token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
const currentUser = ref(usuarioLocal); // { id, nombre, correo, rol }
const isAdmin = currentUser.value?.rol === 'admin';

const obtenerUsuarios = async () => {
  try {
    const res = await axios.get('https://web-ddoii8e37giw.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/users/list');
    usuarios.value = res.data;
  } catch (err) {
    console.error(err);
    alert('Error al obtener usuarios');
  }
};


const guardarUsuario = async () => {
  try {
    if (editando.value) {
      // Sólo admin puede enviar rol en el body (backend lo valida)
      const body = { nombre: form.value.nombre, correo: form.value.correo };
      if (isAdmin && form.value.rol) body.rol = form.value.rol;
      await axios.put(`https://web-ddoii8e37giw.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/users/${form.value.id}`, body);
      alert('Usuario actualizado con éxito');
    } else {
      // Registro público crea user sin rol
      await axios.post('https://web-ddoii8e37giw.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/users/register', {
        nombre: form.value.nombre,
        correo: form.value.correo,
        password: form.value.password
      });
      alert('Usuario registrado con éxito');
    }
    form.value = { id: null, nombre: '', correo: '', password: '', rol: 'user' };
    editando.value = false;
    obtenerUsuarios();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.msg || 'Error al guardar usuario');
  }
};

const editarUsuario = (user) => {
  form.value = { id: user.id, nombre: user.nombre, correo: user.correo, password: '', rol: user.rol || 'user' };
  editando.value = true;
};

const cancelarEdicion = () => {
  form.value = { id: null, nombre: '', correo: '', password: '', rol: 'user' };
  editando.value = false;
};

const eliminarUsuario = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
  try {
    await axios.delete(`https://web-ddoii8e37giw.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/users/${id}`);
    alert('Usuario eliminado con éxito');
    obtenerUsuarios();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.msg || 'Error al eliminar usuario');
  }
};

const cerrarSesion = () => {
  if (confirm('¿Deseas cerrar sesión?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    alert('Sesión cerrada correctamente');
    window.location.href = '/'; // o la ruta de tu Login.vue
  }
};

onMounted(() => {
  obtenerUsuarios();
});
</script>

<style scoped>
.user-container {
  max-width: 700px;
  margin: 40px auto;
  font-family: sans-serif;
}
form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}
input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
button {
  background-color: #0078d4;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background-color: #005fa3;
}
.cancelar {
  background-color: #aaa;
}
.editar {
  background-color: #ffb700;
  color: black;
  margin-right: 5px;
}
.eliminar {
  background-color: #d9534f;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
  color:grey
}
th {
  background-color: #f5f5f5;
}
</style>
