import bcrypt from 'bcrypt'

const salt = bcrypt.genSaltSync(10);

export const hashPassword = (plainPassword)=>{
    return bcrypt.hashSync(plainPassword, salt);
}

export const comparePassword = (password, hashedPassword) =>{
    return bcrypt.compareSync(password, hashedPassword)
}



