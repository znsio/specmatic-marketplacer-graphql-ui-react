import './App.css';
import FindAvailableProductForm from './components/FindAvailableProductForm';
import ProductForm from './components/ProductForm';
import CartForm from './components/CartForm';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';

function App() {
  
  useEffect(() => {
    const handleDocumentClick = () => {
      toast.dismiss();
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div className="App">
      <CartForm/>
      <br/>
      <ToastContainer />
    </div>
  );
}

export default App;
