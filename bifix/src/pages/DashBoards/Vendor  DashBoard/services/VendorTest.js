import { useState } from 'react';
import TestForm from './TestForm';
import VendorTestList from './VendorTestList';

const VendorTest = ({ user }) => {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh(prev => !prev); // trigger refresh

  return (
    <div>
      <TestForm 
        user={user} 
        onTestAdded={handleRefresh} 
        onClose={() => {}}
      />
      <VendorTestList 
        user={user} 
        refresh={refresh} 
        onRefresh={handleRefresh} 
      />
    </div>
  );
};

export default VendorTest;
