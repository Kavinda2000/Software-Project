import { useState } from 'react';
import TestForm from './TestForm'; // or AddServiceForm if you rename
import VendorTestList from './VendorTestList';

const VendorTest = ({ user }) => {
  const [refresh, setRefresh] = useState(false);

  const handleTestAdded = () => setRefresh(prev => !prev); // toggle to refresh list

  return (
    <div>
      <TestForm user={user} onTestAdded={handleTestAdded} onClose={() => {}} />
      <VendorTestList user={user} refresh={refresh} />
    </div>
  );
};

export default VendorTest;
