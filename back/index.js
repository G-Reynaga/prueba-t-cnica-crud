import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import Product from './models/Product.js';
import sequelize from './config/database.js';

dotenv.config();

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

app.use(express.json());

sequelize.sync()
    .then(() => console.log('Tabla de productos lista o sincronizada'))
    .catch((err) => console.error('Error sincronizando la base de datos:', err));


// Crear un producto
app.post('/products', async (req, res) => {
    const { name, description, image_url } = req.body;
    try {
        const product = await Product.create({ name, description, image_url });
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

// Obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Obtener un producto por ID
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);  // Buscar por primary key (ID)
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Actualizar un producto
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, image_url } = req.body;
    try {
        const product = await Product.findByPk(id);
        if (product) {
            product.name = name;
            product.description = description;
            product.image_url = image_url;
            await product.save();
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Eliminar un producto
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (product) {
            await product.destroy();
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

// Arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
