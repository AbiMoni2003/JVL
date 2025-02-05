import React, { useEffect, useState } from 'react'

function Todo() {
    const [title,setTitle]=useState('');
    const [description,setDescription]=useState('');
    const [todos,setTodos]=useState([]);
    const [error,setError]=useState('');
    const [success,setSuccess]=useState('');
    const [editId,setEditId]=useState(-1);
    const [editTitle,setEditTitle]=useState('');
    const [editDescription,setEditDescription]=useState('');

    const apiUrl="http://localhost:3000"
    const handleSubmit=()=>{
        setError("");
        if(title.trim() !== '' && description.trim() !== ''){
            fetch(apiUrl+"/todos",{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({title,description})
            }).then((res)=>{
                if(res.ok){
                    setTodos([...todos,{title,description}])
                  
                    setSuccess("Item added Successfully")
                    
                    setTimeout(()=>{
                        setSuccess("");
                    },3000)
                 
                }
                else{
                    setError("Unable to Create Todo item")
                }
            }).catch(()=>{
                setError("Unable to Create Todo item")
                setTimeout(()=>{
                    setError("");
                },3000)
            })
        }
    }
  
    const getItems=()=>{
        fetch(apiUrl+"/todos")
        .then((res)=>res.json())
        .then((res)=>{
            setTodos(res)
        })
    }
    useEffect(()=>{
        getItems()
    },[])
    const handleUpdate=()=>{
        setError("");
        if(editTitle.trim() !== '' && editDescription.trim() !== ''){
            fetch(apiUrl+"/todos/"+editId,{
                method:"PUT",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({title: editTitle, description: editDescription})
            }).then((res)=>{
                if(res.ok){

                  const updatedTodos =  todos.map((item)=>{
                        if(item._id == editId){
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    })
                    setTodos(updatedTodos)
                    setSuccess("Item Updated Successfully")
                    setTimeout(()=>{
                        setSuccess("");
                    },3000)
                    setEditId(-1);
                }
                else{
                    setError("Unable to Update Todo item")
                }
            }).catch(()=>{
                setError("Unable to Update Todo item")
                setTimeout(()=>{
                    setError("");
                },3000)
            })
        }
    }
    const handleDelete=(id)=>{
        if(confirm('Are you sure to Delete')){
            fetch(apiUrl+"/todos/"+id,{
                method:"DELETE"
            }).then(()=>{
                const updatedTodos = todos.filter((item)=>item._id !== id)
                setTodos(updatedTodos)
            })
        }
    }
  return (
    <>
    <div className='row p-3 bg-success text-light'><h1>Todo-List</h1></div>
    <div className='row'>
        <h3>Add Items</h3>
       {success && <p className=' text-success'>{success}</p>}
        <div className='form-group d-flex gap-2'>
            <input  type='text' className='form-control' placeholder='Title' onChange={(e)=>setTitle(e.target.value)}/>
            <input type='text'  className='form-control' placeholder='Description' onChange={(e)=>setDescription(e.target.value)}/>
            <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className='text-danger'>{error}</p>}
    </div>
    <div className='row mt-3 align-items-center'>
        <h3>Tasks</h3>
        <div className='col-md-6'>

        <ul className='list-group'>
            {
                todos.map((item)=>

        <li className='list-group-item bg-info d-flex justify-content-between align-items-center my-2' key={item._id}>
            <div className='d-flex flex-column'>
                {
                    editId ==-1 || editId !==item._id ?<><span className='fw-bold'>{item.title}</span>
            <span>{item.description}</span></>
            :<>
             <div className='form-group d-flex gap-2'>
            <input  type='text' className='form-control' placeholder='Title' onChange={(e)=>setEditTitle(e.target.value)} value={editTitle}/>
            <input type='text'  className='form-control' placeholder='Description' onChange={(e)=>setEditDescription(e.target.value)} value={editDescription}/>
        </div>
            </>
                }
            
            </div>
            <div className='d-flex gap-2'>
                {
                    editId ==-1 || editId !==item._id ? <> <button className='btn btn-warning' onClick={()=>(setEditId(item._id),setEditTitle(item.title),setEditDescription(item.description))}>Edit</button>
                </>
                :<><button className='btn btn-warning' onClick={handleUpdate} >Update</button></>
                }
                {
                    editId ==-1 || editId !==item._id ? <><button className='btn btn-danger' onClick={()=>{handleDelete(item._id)}}>Delete</button>
                    </>:<>
                    <button className='btn btn-danger' onClick={()=>setEditId(1)}>Cancel</button>
                    </>
                }
            </div>
        </li>
                )
            }
        </ul>
        </div>
    </div>
    </>
  )
}

export default Todo