import User from '../models/User.js';
export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user._id;
        const currentUser=req.user;
        // Fetch users who are not the current user and not already friends
        const recommendedUsers = await User.find({
            _id: { $ne: currentUserId },
            friends: { $nin: [currentUserId] },
            isOnboarded: true, // Only include users who have completed onboarding
        });
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user._id).select('friends').populate("friends");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
export async function sendFriendRequest(req, res) {
    try {
      const recipientId = req.params.id;
      const currentUserId = req.user._id;
  
      if (!recipientId || recipientId === currentUserId.toString()) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
  
      const user = await User.findById(recipientId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.friends.includes(currentUserId)) {
        return res.status(400).json({ message: "Already friends" });
      }
  
      const existingRequest = await FriendRequest.findOne({
        $or: [
          { sender: currentUserId, recipient: recipientId, status: 'pending' },
          { sender: recipientId, recipient: currentUserId, status: 'pending' },
        ],
      });
  
      if (existingRequest) {
        return res.status(400).json({ message: "Friend request already sent" });
      }
  
      const friendRequest = await FriendRequest.create({
        sender: currentUserId,
        recipient: recipientId,
        status: 'pending',
      });
  
      res.status(200).json(friendRequest);
  
    } catch (error) {
      console.error("Error sending friend request:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
  
// export async function sendFriendRequest(req, res) {
//     try {
//         const { userId:recipientId } = req.params.id;
//         const currentUserId = req.user._id;

//         if (!userId || userId === currentUserId) {
//             return res.status(400).json({message: "Invalid user ID"});
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found"} );
//         }

//         // Check if the user is already a friend
//         if (user.friends.includes(currentUserId)) {
//             return res.status(400).json({message: "Already friends"} );
//         }
//         const existingRequest = user.friendRequest.findOne({
//             $or:[
//                 {sender: currentUserId, recipient: userId, status: 'pending'},
//                 {sender: userId, recipient: currentUserId, status: 'pending'},
//             ],
//         });
//         if (existingRequest) {
//             return res.status(400).json({message: "Friend request already sent"} );
//         }
//         const friendRequest=await FriendRequest.create({
//             sender: currentUserId,
//             recipient: userId,
//         })
//         res.status(200).json(freiendRequest);
//     } catch (error) {
//         console.error("Error sending friend request:", error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// }

export async function acceptFriendRequest(req, res) {
    try{
        const {id:requestId}=req.params
        const friendRequest=await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({message:"Friend Request not found"});
        }
        if(friendRequest.recipient.toString()!==req.user.id){
            return res.status(403).json({message:"you are not authorized to accept this request"});
        }friendRequested.status="acccepted";
    await friendRequest.save();
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient},
        });
        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender},
        });
        res.status(200).json({message:"Friend Request Accepted"});
    }   catch(error){
        console.log("Error in accepting Friend Request Controller,", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
export async function getFriendRequests(req,res){
    try{
        const incomingReqs=await FriendRequest.find({
            recipient:req.user.id,
            status:"pending",
        }).populate("sender","fullname,profilePic,navtiveLanguage,learningLanguage");
    const acceptedReqs=await FriendRequest.find({
        sender:req.user.id,
        status:"accepted",
    }).populate("recipient","fullname","profilePic");
    res.status(200).json({incomingReqs,acceptedReqs});
}catch(error){
    console.log("Error in getPendingRequest Controller",error.message);
    res.status(500).json({massage:"Internal Server Error"});
    }
}

export async function getOutgoingFriendReqs(req,res){
    try{
        const outgoingReqs=await FriendRequest.find({
            sender:req.user.id,
            status:"pending",
        }).populate("recipient","fullname","profilePic","nativeLanguage","learningLanguage")
    res.status(200).json(outgoingReqs)
    }catch(error){
        console.log("Error in getOutgoingReqs Controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}