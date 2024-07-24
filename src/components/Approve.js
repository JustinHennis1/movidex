// components/Approve.js

// TBC This can be used to upgrade from a guest session to a full user session




// import React, { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const Approve = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   useEffect(() => {
//     const createSession = async (requestToken) => {
//       try {
//         const response = await fetch(`/api/sessionCallback?request_token=${requestToken}`);
//         const data = await response.json();
//         if (response.ok) {
//           console.log('Session ID:', data.session_id);
//           // save the session ID in your context or state here
//           navigate('/'); // Redirect to the home page or any other page
//         } else {
//           console.error('Failed to create session ID');
//         }
//       } catch (error) {
//         console.error('Error creating session ID:', error);
//       }
//     };

//     const params = new URLSearchParams(location.search);
//     const requestToken = params.get('request_token');
//     if (requestToken) {
//       createSession(requestToken);
//     }
//   }, [location, navigate]);

//   return (
//     <div>
//       <h1>Approving...</h1>
//       <button>
//         <a href='http://localhost:3000'>GO HOME</a>
//       </button>
//     </div>
//   );
// };

// export default Approve;
