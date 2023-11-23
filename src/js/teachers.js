const txtNameElm = document.querySelector("#txt-name");
const txtContactElm = document.querySelector("#txt-contact");
const btnSaveElm = document.querySelector("#btn-save");
const tblBodyElm =  document.querySelector("#tbl-body");
const {API_URL} = process.env

let teacherId=0;

loadAllTeachers();

function loadAllTeachers(){
    fetch(`${API_URL}/app/teachers`)
    .then(res => {
        if(res.ok){
            res.json().then(teacherList => teacherList.forEach(teacher => createTeacher(teacher)))
        }else{
            alert("Faild to load teacher list")
        }
    }).catch(err => {
        alert("Something went wrong please try again");
    });
}

function createTeacher(teacher) {
    const newTrElm = document.createElement("tr");
    newTrElm.id = "teacher-" + teacher.id;
    newTrElm.innerHTML = `            
                        <td>${teacher.name}</td>
                        <td>${teacher.contact}</td>
                        <td class="d-flex justify-content-center">
                            <i class="edit bi bi-pencil-fill me-3" title="Edit"></i>
                            <i class="delete bi bi-trash3-fill" title="Delete"></i>
                        </td>
            `;
    tblBodyElm.append(newTrElm);
}

btnSaveElm.addEventListener("click", () => {
    if(btnSaveElm.innerText === "SAVE"){
        const name = txtNameElm.value;
        const contact = txtContactElm.value;
        if(name.trim().length === 0){
            txtNameElm.focus();
            txtNameElm.select();
            return;
        } else if (contact.trim().length === 0) {
            txtContactElm.focus();
            txtContactElm.select();
        }

        fetch(`${API_URL}/app/teachers`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(
                {
                    name: txtNameElm.value,
                    contact: txtContactElm.value
                }
            )
        }).then(res => {
            if(res.ok){
                res.json().then(teacher => {
                    createTeacher(teacher);
                    txtNameElm.value = "";
                    txtContactElm.value = "";
                    txtNameElm.focus();
                    txtContactElm.focus();
                })
            } else {
                alert("Faild to add teacher");
            }
        }).catch(err => {
            alert("Something went worng. Try again later");
        })
    } else if (btnSaveElm.innerText === "UPDATE"){
        const teacher = {
            name: txtNameElm.value,
            contact: txtContactElm.value
        };
        fetch(`${API_URL}/app/teachers/${teacherId}`, {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(teacher)
        }).then(res => {
            if (!res.ok){
                txtNameElm.focus();
                alert("Failed to update the teacher");
            }else {
                txtNameElm.value = "";
                txtContactElm.value = "";
                loadAllTeachers();
                btnSaveElm.innerText === "SAVE"
            }
        }).catch(err => {
            txtNameElm.focus();
            alert("Something went wrong, try again");
        })
    } 

})


tblBodyElm.addEventListener("click", (e) => {
    if(e.target?.classList.contains("delete")){
        teacherId = e.target.closest("tr").id.substring(8);

        fetch(`${API_URL}/app/teachers/${teacherId}`, {method: "DELETE"})
        .then(res => {
            if(res.ok){
                e.target.closest("tr").remove();
            } else {
                alert("Faild to delete the teacher");
            }
        }).catch(err => {
            alert("Something went wrong, try again");
        })  
    } else if(e.target?.classList.contains("edit")){
        teacherId = e.target.closest("tr").id.substring(8);
        txtNameElm.value = e.target
        console.log(e.target.closest);
        txtContactElm.value = e.target
        btnSaveElm.innerText = "UPDATE";
    }
})


txtContactElm.addEventListener("keypress", (e)=>{
    if(e.key === "Enter") {
        btnSaveElm.click();
    }
})
