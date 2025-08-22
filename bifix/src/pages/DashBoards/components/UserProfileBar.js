import { useState } from 'react';
import './UserProfileBar.css';

const defaultProfilePic = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

function UserProfileBar({ userData, onUpdateProfile, isUpdating }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    role: userData?.role || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
    profilePicture: userData?.profilePicture || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  await onUpdateProfile(formData); // let parent handle isUpdating
  setIsEditing(false);
};


  return (
    <div className="userprofilebar-container" style={{ pointerEvents: isUpdating ? 'none' : 'auto' }}>
      <div className="userprofilebar-image-wrapper">
        <img
          src={formData.profilePicture || defaultProfilePic}
          alt="User Profile"
          className="userprofilebar-image"
        />
        {!isEditing && (
          <button className="userprofilebar-change-btn" onClick={() => setIsEditing(true)} disabled={isUpdating}>
            Update Profile
          </button>
        )}
      </div>

      {!isEditing ? (
  <div
    className="userprofilebar-info"
    style={{ filter: isUpdating ? 'blur(2px)' : 'none', pointerEvents: isUpdating ? 'none' : 'auto' }}
  >
    <h3 className="userprofilebar-name">{formData.name || 'User Name'}</h3>
    <p className="userprofilebar-role">Role: {formData.role || 'Customer'}</p>
    <p className="userprofilebar-email">Email: {userData?.email || 'user@example.com'}</p>
    <p className="userprofilebar-phone">Tel: {formData.phone || '123-456-7890'}</p>
    <p className="userprofilebar-address">Address: {formData.address || '123 Main St, City, Country'}</p>
  </div>
) : (
  <div className="userprofilebar-modal-overlay">
    <form className="userprofilebar-form-modal" onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        Role:
        <input type="text" value={formData.role} disabled readOnly />
      </label>
      <label>
        Email:
        <input type="email" value={userData?.email || ''} disabled readOnly />
      </label>
      <label>
        Phone:
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
      </label>
      <label>
        Address:
        <input type="text" name="address" value={formData.address} onChange={handleChange} />
      </label>
      <label>
        Upload Profile Picture:
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>
      <div className="userprofilebar-modal-buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
      </div>
    </form>
  </div>
)}

    </div>
  );
}

export default UserProfileBar;
