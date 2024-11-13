import { useEffect, useState } from 'react'
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    image_url: '',
  });

  const [editProduct, setEditProduct] = useState(null);

  // Obtener productos de la API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products');
      console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Agregar un nuevo producto
  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/products', newProduct);
      setProducts([...products, response.data]);
      setNewProduct({ name: '', description: '', image_url: '' });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Actualizar un producto
  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/products/${editProduct.id}`, editProduct);
      const updatedProducts = products.map((product) =>
        product.id === editProduct.id ? response.data : product
      );
      setProducts(updatedProducts);
      setEditProduct(null);
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  // Eliminar un producto
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className='container mx-auto p-4 space-y-4'>
      <h1 className="text-4xl font-bold mb-4">Productos</h1>

      <h2 className="text-2xl font-semibold mb-2">Agregar Producto</h2>
      <form onSubmit={handleAddProduct}>
        <div className='space-y-4'>
          <div>
            <input
              type="text"
              placeholder="Nombre del producto"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className='w-full p-2 border border-gray-300 rounded-md'
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Descripción"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className='w-full p-2 border border-gray-300 rounded-md'
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Imagen URL"
              value={newProduct.image_url}
              onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
              className='w-full p-2 border border-gray-300 rounded-md'
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Agregar Producto
          </button>
        </div>
      </form>

      <h2 className="text-2xl font-semibold mb-2">Lista de Productos</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border-b p-2">ID</th>
            <th className="border-b p-2">Nombre</th>
            <th className="border-b p-2">Descripción</th>
            <th className="border-b p-2">Imagen</th>
            <th className="border-b p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr className='text-center' key={product.id}>
              <td className="border-b p-2">{product.id}</td>
              <td className="border-b p-2">{product.name}</td>
              <td className="border-b p-2">{product.description}</td>
              <td>
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: '100px' }}
                  className="w-20 h-auto object-contain"
                />
              </td>
              <td className='flex gap-2 justify-center text-center'>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={() => setEditProduct(product)}>Editar</button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={() => handleDeleteProduct(product.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editProduct && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Editar Producto</h2>
          <form onSubmit={handleEditProduct}>
            <div className='space-y-4'>
              <div>
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  className='w-full p-2 border border-gray-300 rounded-md'
                  required
                />
              </div>

              <div>
                <textarea
                  value={editProduct.description}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  className='w-full p-2 border border-gray-300 rounded-md'
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  value={editProduct.image_url}
                  onChange={(e) => setEditProduct({ ...editProduct, image_url: e.target.value })}
                  className='w-full p-2 border border-gray-300 rounded-md'
                  required
                />
              </div>
              <div className='flex gap-2'>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Actualizar Producto</button>
                <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={() => setEditProduct(null)}>Cancelar</button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}

export default App
