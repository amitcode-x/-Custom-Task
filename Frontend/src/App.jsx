import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import AddProduct from "./pages/AddProduct";
import Dealers from "./pages/Dealers";
import AddDealer from "./pages/AddDealer";

import AddInventory from "./pages/AddInventory";


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/dealers" element={<Dealers />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/add-dealer" element={<AddDealer />} />

        
     <Route path="/add-inventory" element={<AddInventory />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
