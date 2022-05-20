import axios from "axios"
import React, { useState } from "react"
import { useContext, useEffect } from "react"
import AppContext from "../components/AppContext"
import { useRouter } from "next/router"

export default function ManageUsers() {
    const { state } = useContext(AppContext)
    const [users, setUsers] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            await axios.get("http://localhost:3001/users", { headers: { authentification: state?.jwt } }).then(res => {
                setUsers(res.data)
            })
        }
        fetchData()
    }, [state?.jwt])


    const deleteUser = async (userId) => {
        await axios.delete("http://localhost:3001/users/" + userId, { headers: { authentification: state?.jwt } }).then(() => {
            router.reload()
        })
    }


    const manageUserStatus = async (userId, status) => {
        await axios.put("http://localhost:3001/users/" + userId + "/status", { etat: status }, { headers: { authentification: state?.jwt } }).then(() => {
            router.reload()
        })
    }

    const updateUserProfile = async (userId, selectId) => {
        const profil = document.getElementById(selectId)?.value
        await axios.put("http://localhost:3001/users/" + userId + "/profil", { profil: profil }, { headers: { authentification: state?.jwt } }).then(() => {
            router.reload()
        })
    }

    return (

        <div className="container mx-auto flex flex-wrap py-6">
            <div className="w-full md:w-3/3 flex flex-col items-center px-3">
                <table className="table_user">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Profil</th>
                            <th>Status</th>
                            <th colSpan="3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => {
                            return (
                                <tr key={index}>
                                    <td>{user.id}</td>
                                    <td>{user.displayName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.userType}</td>
                                    <td>{user.active ? "Active" : "Disabled"}</td>
                                    <td className="text-center">
                                        <div className="border">
                                            {
                                                state?.userType === "supper-admin" &&
                                                <>
                                                    <select id={"user_type_" + user.id} className="border">
                                                        <option value="">-- Please choose profil --</option>
                                                        <option value="admin">admin</option>
                                                        <option value="autheur">autheur</option>
                                                        <option value="reader">reader</option>
                                                    </select>
                                                    <button className="bg-green-600 text-xs p-1 text-green-100 border m-1 font-semibold text-md rounded"
                                                        onClick={() => updateUserProfile(user.id, "user_type_" + user.id)}>Save</button>
                                                    <span className="pl-10"></span>
                                                </>
                                            }

                                            <button className="bg-red-600 text-xs p-1 text-green-100 border m-1 font-semibold text-md rounded"
                                                onClick={() => deleteUser(user.id)}>delete</button>
                                            <button className="bg-yellow-600 text-xs p-1 text-green-100 border m-1 font-semibold text-md rounded"
                                                onClick={() => manageUserStatus(user.id, !user.active)}>{user.active ? "deactivate" : "activate"}</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

