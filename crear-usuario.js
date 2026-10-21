
const readline = require('readline');
const bcrypt = require('bcryptjs');
const pool = require('./db');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function preguntar(texto) {
    return new Promise(resolve => rl.question(texto, resolve));
}

async function main() {
    try {
        const usuario = (await preguntar('Usuario: ')).trim();
        const password = await preguntar('Contraseña: ');

        if (!usuario || usuario.length > 100 || !password ||
            Buffer.byteLength(password, 'utf8') > 72) {
            throw new Error('Usuario o contraseña inválidos.');
        }

        const hash = await bcrypt.hash(password, 12);

        const resultado = await pool.query(
            `INSERT INTO usuarios (usuario, password_hash)
             VALUES ($1, $2)
             RETURNING id, usuario, activo, creado_en`,
            [usuario, hash]
        );

        console.log('Usuario creado correctamente:');
        console.log(resultado.rows[0]);
    } catch (error) {
        console.error('No se pudo crear el usuario:', error.message);
    } finally {
        rl.close();
        await pool.end();
    }
}

main();