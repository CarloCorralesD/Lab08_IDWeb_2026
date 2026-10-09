const pool = require('../db');

exports.getEstudiantes = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM estudiantes ORDER BY id'
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al obtener estudiantes'
        });
    }
};

exports.getEstudianteById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM estudiantes WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Estudiante no encontrado'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Error al obtener estudiante'
        });
    }
};

exports.createEstudiante = async (req, res) => {
    try {
        const { nombre, email, carrera } = req.body;

        const result = await pool.query(
            `INSERT INTO estudiantes
             (nombre, email, carrera)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [nombre, email, carrera]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Error al crear estudiante'
        });
    }
};

exports.updateEstudiante = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, carrera } = req.body;

        const result = await pool.query(
            `UPDATE estudiantes
             SET nombre = $1,
                 email = $2,
                 carrera = $3
             WHERE id = $4
             RETURNING *`,
            [nombre, email, carrera, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Estudiante no encontrado'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Error al actualizar estudiante'
        });
    }
};

exports.deleteEstudiante = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM estudiantes WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Estudiante no encontrado'
            });
        }

        res.json({
            message: 'Estudiante eliminado',
            estudiante: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Error al eliminar estudiante'
        });
    }
};