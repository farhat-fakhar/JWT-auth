import { User } from "../Models/userModel.js";

const getUserData = async (req, res) => {
  try {
    const  userId  = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.send({ success: false, message: "user not found!" });
    }
    return res.send({
      success: true,
      userData: {
        name: user.name,
        isAccountVerfied: user.isAccountVerfied,
      },
    });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
};
export default getUserData;
