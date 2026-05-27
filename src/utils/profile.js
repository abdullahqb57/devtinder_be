const validateProfileData = (req) => {
    const ALLOWED_FIELDS = [
        "firstName",
        "lastName",
        "age",
        "about",
        "gender",
        "photoUrl"
    ];
   return Object.keys(req.body).every((key) => ALLOWED_FIELDS.includes(key));
}

export default validateProfileData;