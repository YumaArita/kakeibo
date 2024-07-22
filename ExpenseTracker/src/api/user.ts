import client from "./sanityClient";

export const getUserProfileByUserId = async (userId: string) => {
  try {
    const query = `*[_type == "user" && _id == $userId]`;
    const params = { userId };
    const result = await client.fetch(query, params);
    return result[0];
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const updateUserProfileByUserId = async (
  userId: string,
  username: string,
  email: string,
  password: string
) => {
  try {
    const query = `*[_type == "user" && _id == $userId]`;
    const params = { userId };
    const user = await client.fetch(query, params);
    if (user && user[0] && user[0]._id) {
      await client
        .patch(user[0]._id)
        .set({ username, email, password })
        .commit();
      return { success: true };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error };
  }
};
