
import react, { useCallback } from 'react';
 
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
    console.log('producPage.js')
   const handleSubmit = useCallback((orderDetails) =>  {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  },[productId])

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
