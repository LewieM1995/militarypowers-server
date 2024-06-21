function generateEnemyProfiles() {
    const baseProfile = {
      units: {
        infantry: 110,
        navy: 5,
        airForce: 93,
        technology: 10,
        logistics: 2,
        intelligence: 10,
      },
      profileStats: {
        level: 10,
      },
    };
  
    const countryNames = [
      "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
      "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
      "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
      "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the",
      "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
      "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
      "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
      "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
      "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South",
      "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
      "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius"
    ];
  
    const profiles = [];
  
    for (let level = 1; level <= 100; level++) {
      const multiplier = Math.pow(1.04, level - 1);
  
      const profile = {
        id: level,
        name: countryNames[level - 1], // Assign a country name based on the level
        level: level,
        units: {
          infantry: Math.round(baseProfile.units.infantry * multiplier),
          navy: Math.round(baseProfile.units.navy * multiplier),
          airForce: Math.round(baseProfile.units.airForce * multiplier),
          technology: Math.round(baseProfile.units.technology * multiplier),
          logistics: Math.round(baseProfile.units.logistics * multiplier),
          intelligence: Math.round(baseProfile.units.intelligence * multiplier)
        },
        profileStats: {
          ...baseProfile.profileStats,
          level: level
        }
      };
  
      profiles.push(profile);
    }
  
    return profiles;
  }
  
  module.exports = {
    generateEnemyProfiles
  };
  