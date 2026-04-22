export const TOKEN_KEY = "@imob7-token";
export const USER_KEY = "@imob7-user";

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = (): null | any => {
  const userString = localStorage.getItem(USER_KEY);
  if (userString) {
    const user = JSON.parse(userString);
    return user;
  } else {
    return null;
  }
};

export const login = (token: string, user: any) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
