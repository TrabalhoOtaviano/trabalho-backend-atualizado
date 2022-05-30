import { Schedules } from './../entity/schedules';
import { Hour } from './../entity/hour';
import { Service } from './../entity/service';
import { User } from "../entity/User"
import { AppDataSource } from "../data-source";
import { UserTypes } from "../entity/userType";

const userRepository = AppDataSource.getRepository(User)

async function findAll(req,res){
    const allUsers:any = await userRepository.find({
        relations: {
            userTypes:true,
        }
    })
    .then( (allUsers) => res.json(allUsers))
    console.log("All users from the db: ", allUsers)
}

async function findUser(req,res){
    const _id= req.params.id
    const findUser:any = await userRepository.findOne({
        where: {id:_id},
          relations: {
            userTypes:true,
        }
        
    }).then( (findUser) => res.json(findUser))
    console.log("User ",findUser, " was found from the db: " )
}

async function updateUser(req,res){
   const _id=req.params.id
  
    let updateUser:any = await userRepository.findOneBy({
        id: _id,
    })
    updateUser=req.body
    await userRepository.save( updateUser)
    .then( (updateUser) => res.json(updateUser))
    console.log("User updated from the db: ", updateUser)
}
async function addUser(req,res){
    let UserTypeIdToSearch=req.body.userTypes
    const findUserRepository = AppDataSource.getRepository(UserTypes)
    let userTypesId = await findUserRepository.findOneBy({
        Type_id: UserTypeIdToSearch,
    })
    const registerUse:any= new User()
    registerUse.firstName = req.body.firstName
    registerUse.lastName = req.body.lastName
    registerUse.email=req.body.email
    registerUse.nickname=req.body.nickname
    registerUse.password=req.body.password
    registerUse.userTypes=userTypesId
    const addUser:any = await userRepository.save(registerUse)
    .then( (addUser) => res.json(addUser))
    console.log("New user from the db: ", addUser)
}

async function deleteUser(req,res){
    let idUserDelete=req.params.id
    const deleteHourRepository = AppDataSource.getRepository(Hour)
    let findHourDelete = await deleteHourRepository.query(
        `DELETE FROM hour where userId=?;`   , [idUserDelete] 
    )
    const deleteScheduleRepository = AppDataSource.getRepository(Schedules)
    let findScheduleDelete = await deleteScheduleRepository.query(
        `DELETE FROM schedule where userId=?;`   , [idUserDelete] 
    )
    const deleteServiceRepository = AppDataSource.getRepository(Service)
    let findDelete = await deleteServiceRepository.query(
        `DELETE FROM service where userId=?;`   , [idUserDelete] 
    )
    let userToDelete:any = await userRepository.findOneBy({
        id:idUserDelete,
    })
    await userRepository.remove(userToDelete)
    .then( (userToDelete) => res.json(userToDelete))
    console.log("User removed from the db: ", userToDelete)
}

export default { findAll,findUser,updateUser,addUser,deleteUser } 

