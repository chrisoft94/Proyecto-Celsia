<template>
  <div class="login">
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="login">
      <input v-model="correo" placeholder="Correo" />
      <input v-model="password" type="password" placeholder="Contraseña" />
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      correo: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        const res = await axios.post('https://web-ddoii8e37giw.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/auth/login', {
          correo: this.correo,
          password: this.password
        })

        // Guardar token
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('usuario', JSON.stringify(res.data.usuario));


        // Redirigir a UserManager
        this.$router.push('/users')
      } catch (error) {
        alert('Credenciales incorrectas')
      }
    }
  }
}
</script>
