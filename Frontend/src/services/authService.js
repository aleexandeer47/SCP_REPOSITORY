// Real auth against Backend/src/controller/loginController.js — usuario +
// contrasena, httpOnly JWT cookie (no token handled client-side at all).
// login()'s response only carries { message, userType }, so we immediately
// follow it with /loginAdmin/verify to get the full profile (incl. the
// populated company) that the rest of the app reads via useAuth().
import { request } from './api'

export async function login({ username, password }) {
  await request('/loginAdmin', {
    method: 'POST',
    body: JSON.stringify({ usuario: username, contrasena: password }),
    skipAuthHandler: true,
  })
  return getSession()
}

export async function getSession() {
  const data = await request('/loginAdmin/verify', { skipAuthHandler: true })
  return data.user
}

export async function logout() {
  await request('/logout', { method: 'POST', skipAuthHandler: true })
}

// Public signup — creates a brand new company and its first admin together.
// See Backend/src/controller/publicRegisterController.js. Every other user
// for that company is added afterward from the authenticated Usuarios screen.
export async function registerCompany({ companyName, nit, username, password, email }) {
  return request('/registro', {
    method: 'POST',
    body: JSON.stringify({
      nombre_empresa: companyName,
      nit,
      usuario: username,
      contrasena: password,
      email,
    }),
    skipAuthHandler: true,
  })
}

// Recovery: request code by email -> verify code -> set new password.
// See Backend/src/controller/recoveryPasswordController.js.
export async function requestPasswordReset(email) {
  return request('/recoveryPasswordAdmin/requestCode', {
    method: 'POST',
    body: JSON.stringify({ email }),
    skipAuthHandler: true,
  })
}

export async function verifyResetCode(code) {
  return request('/recoveryPasswordAdmin/verifyCode', {
    method: 'POST',
    body: JSON.stringify({ code }),
    skipAuthHandler: true,
  })
}

export async function resetPassword({ newPassword, confirmPassword }) {
  return request('/recoveryPasswordAdmin/newPassword', {
    method: 'POST',
    body: JSON.stringify({ newPassword, confirmNewPassword: confirmPassword }),
    skipAuthHandler: true,
  })
}
