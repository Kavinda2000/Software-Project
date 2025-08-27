import React, { useState } from 'react';
import AddVendorProduct from './AddVendorProduct';
import VendorProductList from './VendorProductList';

const VendorDashboard = ({ user }) => {
  const [refresh, setRefresh] = useState(false);

  const handleProductAdded = () => setRefresh(prev => !prev); // toggle to refresh

  return (
    <div>
      <AddVendorProduct user={user} onProductAdded={handleProductAdded} />
      <VendorProductList user={user} refresh={refresh} />
    </div>
  );
};

export default VendorDashboard;