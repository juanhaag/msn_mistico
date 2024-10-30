# Registro y Autenticación

## Requisitos

1. Instalar `nodemailer`.
2. Crear una cuenta en [Mailtrap](https://mailtrap.io), que es el servicio para probar correos.

## Configuración

1. En el archivo `.env`, coloca las credenciales proporcionadas por Mailtrap.

## Flujo de Registro

1. Al completar el flujo de registro, se enviará un correo electrónico a Mailtrap.
2. Haz clic en el enlace generado en el correo para verificar la cuenta.

## Autenticación

Para acceder al resto de los endpoints, debes enviar el token en el cuerpo de la solicitud con la clave `authToken`.

### Ejemplo

```http
POST localhost:8081/user/1
Content-Type: application/json

{
    "authToken": "noEsJwT-4bc60458379757101eb0bc2e811542abfa53734debdb1ed691ef398680a36dab"
}