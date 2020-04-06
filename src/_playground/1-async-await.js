require("../db/mongoose");
const Users = require("../model/user");
/*
Users.findByIdAndDelete('5e8096a4cbb2ac143c03cf3b').then(res => {
    console.log(res);
    return Users.countDocuments({email: 'boom@gmail.com'});
}).then(res => {
   console.log('Emails count ', res); 
});
*/

const deleteUserById = async (id, email) => {
    const deletedUser = await Users.findByIdAndDelete(id);
    const remainUser = await Users.countDocuments({email: email});

    return {deletedUser, remainUser}
}

deleteUserById('5e7fa056ce1a150c3c9e3eab', 'boom@gmail.com').then(res => {
    console.log(res);
});