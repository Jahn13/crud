const API = 'https://api.escuelajs.co/api/v1/'
const containerProducts = document.querySelector("#containerProducts")
const myModal = document.querySelector("#staticBackdrop")
const form = document.querySelector("#myForm");
const spinerModal = document.querySelector("#spinerModal");
const btnModal = document.querySelector("#btnModal");

const getProducts = async (url, options = {}) => {
  try{
      const response = await fetch(url, options);
      const data = await response.json();

      return data;
  }
  catch(error){
      console.log(error)
  }
}

const products = async (api) => {
    let url = `${api}products?offset=0&limit=10`
    let forms = await getProducts(url)
    let saveProducts = ""
    forms.forEach((element, index) => {
        saveProducts  += `
        <tr>
            <th scope="row">${index + 1}</th>
            <th scope="row">${element.title}</th>
            <td>${element.description}</td>
            <td>Q${element.price}</td>
            <td>${element.category.id}</td>
            <td>  
                <img src="${element.images}" class="img-fluid">
            </td>
            <td class="d-flex align-items-center flex-column">
              <button value="${element.id}" name="Update" type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Update</button>
              <button value="${element.id}" name="Delete" type="button" class="btn btn-outline-danger btn-sm mt-1" onclick="deleteProduct(${element.id})">Delete</button>
            </td>
        </tr>
        `
    });
    containerProducts.innerHTML = saveProducts;
}

products(API);


const createOrUpdateProduct = async (event) => {
  let title = document.querySelector(".name").value;
  let description = document.querySelector(".description").value;
  let price = document.querySelector(".price").value;
  let category = document.querySelector("#selectCategory").value;
  let image = document.querySelector(".image").value;

  let options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: 'POST',
    body: JSON.stringify({
      title,
      description,
      price,
      "categoryId": category,
      "images": [image]
    })
  };

  let url = `${API}products/` 
  let product;
  
  switch(event.target.name){
    case "crear":
      console.log("Esta creando un producto")

      product = await getProducts(url, options);

      console.log(`Su producto ${product.title} ha sido agregado`);
      break;
    case "actualizar":
      console.log("Esta actualizando un producto")

      options = {
        headers: {
          "Content-Type": "application/json"
        },
        method: 'PUT',
        body: JSON.stringify({
          title,
          description,
          price,
          "categoryId": category,
          "images": [image]
        })
      };

      product = await getProducts(`${url}${event.target.value}`, options)
      alert(`${product.title} fue actualizado`)

      break;
  }

}

myModal.addEventListener('shown.bs.modal', async (event) => {
  switch(event.relatedTarget.name){
    case "Nuevo producto":
      btnModal.textContent = "Crear Producto"
      btnModal.value = ""
      btnModal.name = "crear"
      form.classList.remove("d-none")
      spinerModal.classList.add("d-none")
      break;
    case "Update":
      let id = event.relatedTarget.value;
      btnModal.textContent = "Actualizar Producto"
      btnModal.value = id;
      btnModal.name = "actualizar"

      let product = await getProducts(`${API}products/${id}`);
      spinerModal.classList.add("d-none");
      form.classList.remove("d-none");

      document.querySelector(".name").value = product.title;
      document.querySelector(".description").value = product.description;
      document.querySelector(".price").value = product.price;
      document.querySelector("#selectCategory").value = product.category.id;
      document.querySelector(".image").value = product.images;
    break;
  }
  console.log("Se abrio", event.relatedTarget.textContent)
})

myModal.addEventListener("hidden.bs.modal", () => {
  form.reset();
  spinerModal.classList.remove("d-none");
  form.classList.add("d-none")
})

let deleteP;

const deleteProduct = (id) => {
    const toastLiveExample = document.getElementById('liveToast')
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show()

    let options = {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'DELETE'
    }

    let btnConfirm = document.querySelector("#btnConfirm")
    btnConfirm.removeEventListener("click", deleteP);

    deleteP = async () => {
        try {
            await getProducts(`${API}products/${id}`, options)
            alert("Se ha eliminado")
            toast.hide()
         
        }catch(error)
        {
            console.error(error);
        }
    };   

    btnConfirm.addEventListener("click",  deleteP)
}


const categories = async () => {
  let categoriesProduct = await getProducts(`${API}categories`)
  console.log(categoriesProduct)

  let selectCategory = document.querySelector("#selectCategory")

  categoriesProduct.forEach(element => {
    selectCategory.innerHTML += `<option value="${element.id}">${element.name}</option>`
  })
}
categories();