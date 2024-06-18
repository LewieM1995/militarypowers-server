

const initialProfile = {
    budget: 200000,
    units: {
      infantry: 50,
      navy: 5,
      airForce: 5,
      technology: 2,
      logistics: 2,
      intelligence: 2,
    },
    profileStats: {
      level: 0,
      xp: 0,
      nextLevelXp: 500,
    },
  };
  
  let users = [ 
    {email: 'tester1@gmail.com', password: 'pass', profile: initialProfile}
   ]; 

   //console.log('users', users)
  
  const checkUser = (req, res) => {
    const { email, password } = req.body;
    //console.log('email', email);
    const user = users.find(u => u.email === email && u.password === password);
  
    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  };
  
  const addUser = (req, res) => {
    const { email, password } = req.body;
    try {
      const newUser = {
        email,
        password,
        profile: initialProfile,
      };
      users.push(newUser);
      //console.log('new user email', email)
      res.json({ success: true });
    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  };

  const getUser = (req, res) => {
    try {
      const data = users[0];
      //console.log(data)
      res.json(data)
    } catch (error) {
      console.error('errorin getUser', error)
    }
  }
  
  module.exports = {
    checkUser,
    addUser,
    getUser,
  };
  