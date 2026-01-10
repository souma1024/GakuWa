
export const useAuth = () => {

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      const result = await response.json();

      if (result.success) {
        window.location.replace("/");
      } else {
        throw ('error');
      }
    } catch (e) {
      console.log("ログアウトエラー")
    }
  } 

  return {
    handleLogout
  };
};
