// If sidebar menu tabs was clicked
// Get all sidebar links
const sidebarLinks = document.querySelectorAll(".sidebar-menu a");

// Add click event to each sidebar link
sidebarLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        // Prevent the default behavior of the link
        e.preventDefault();

        // Remove "active" class from all links
        sidebarLinks.forEach(link => link.classList.remove("active"));

        // Add "active" class to the clicked link
        e.currentTarget.classList.add("active");

        // Navigate to the clicked link's href
        window.location.href = e.currentTarget.getAttribute("href");
    });
});

// === ADD PRODUCT ===
// Get elements for the Add modal and the button to open it
const modalAdd = document.getElementById('myModal-add');
const openModalAddButton = document.getElementById('openModal-add');
const closeModalAdd = document.querySelector('.close-add');
const productFormAdd = document.getElementById('productForm-add');
const productTableBody1 = document.querySelector('#productTable-product tbody');

// Function to update the product table (Add)
function updateProductTableAdd() {
  const productTableBody = document.querySelector('#productTable-product tbody');
  productTableBody.innerHTML = '';  // Clear existing rows
  products.forEach((product) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${product.productCode}</td>
      <td>${product.productName}</td>
      <td>₱${parseFloat(product.price).toFixed(2)}</td>
    `;
    productTableBody.appendChild(newRow);
  });
}

// Open Add Modal
openModalAddButton.addEventListener('click', () => {
  modalAdd.style.display = 'flex';  // Show the Add modal
});

// Close Add Modal
closeModalAdd.addEventListener('click', () => {
  modalAdd.style.display = 'none';  // Close the Add modal
});

// Close Add modal when clicking outside of it
window.addEventListener('click', (event) => {
  if (event.target === modalAdd) {
    modalAdd.style.display = 'none';
  }
});

// Handle form submission to add products to the list
productFormAdd.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form from reloading the page

  // Get form input values
  const productCode = document.getElementById('productCode-add').value;
  const productName = document.getElementById('productName-add').value;
  const price = document.getElementById('price-add').value;

  // Create a new product object
  const newProduct = {
    productCode,
    productName,
    price
  };

  // Add product to products array
  products.push(newProduct);

  // Update the product table to show the new product
  updateProductTableAdd();

  // Reset the form
  productFormAdd.reset();
});





// === EDIT PRODUCT ===
// Get elements for the Edit modal and the button to open it
const modalEdit = document.getElementById('myModal-edit');
const openModalEditButton = document.querySelector('.button.edit');
const closeModalEdit = document.querySelector('.close-edit');
const productFormEdit = document.getElementById('productForm-edit');
const cancelEditButton = document.querySelector('.cancel-btn');
const productSelect = document.getElementById('product-select'); // Dropdown for product selection
const productCodeEdit = document.getElementById('productCode-edit');
const productNameEdit = document.getElementById('productName-edit');
const priceEdit = document.getElementById('price-edit');

// Array to store products (shared between Add and Edit functionality)
let products = [];

// Function to load products from localStorage
function loadProductsFromLocalStorage() {
  const savedProducts = JSON.parse(localStorage.getItem('products'));
  if (savedProducts) {
    products = savedProducts;
  }
  updateProductTableAdd();  // Update the table with current data
}

// Function to update the product table with current products
function updateProductTableAdd() {
  const productTableBody = document.querySelector('#productTable-product tbody');
  productTableBody.innerHTML = '';  // Clear existing rows

  products.forEach((product, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.productCode}</td>
      <td>${product.productName}</td>
      <td>₱${parseFloat(product.price).toFixed(2)}</td>
    `;
    productTableBody.appendChild(row);
  });
}

// Function to populate the Edit product dropdown
function populateProductDropdown() {
  productSelect.innerHTML = '<option value="">-- Select a Product --</option>'; // Clear existing options
  products.forEach((product, index) => {
    const option = document.createElement('option');
    option.value = index; // Use index as value
    option.textContent = `${product.productCode} - ${product.productName} (₱${parseFloat(product.price).toFixed(2)})`;
    productSelect.appendChild(option);
  });
}

// Open Edit Modal
openModalEditButton.addEventListener('click', () => {
  modalEdit.style.display = 'flex';  // Show the Edit modal
  populateProductDropdown();  // Populate the dropdown with existing products
});

// Close Edit Modal
closeModalEdit.addEventListener('click', () => {
  modalEdit.style.display = 'none';  // Close the Edit modal
});

// Close Edit modal when clicking outside of it
window.addEventListener('click', (event) => {
  if (event.target === modalEdit) {
    modalEdit.style.display = 'none';
  }
});

// Handle product selection change in the Edit modal
productSelect.addEventListener('change', (e) => {
  const selectedProductIndex = parseInt(e.target.value, 10);
  const selectedProduct = products[selectedProductIndex];

  if (selectedProduct) {
    // Populate form fields with the selected product's details
    productCodeEdit.value = selectedProduct.productCode;
    productNameEdit.value = selectedProduct.productName;
    priceEdit.value = selectedProduct.price;
  }
});

// Handle form submission for editing the product
productFormEdit.addEventListener('submit', (e) => {
  e.preventDefault();

  const selectedProductIndex = parseInt(productSelect.value, 10);
  if (selectedProductIndex !== -1) {
    const updatedProductCode = productCodeEdit.value;
    const updatedProductName = productNameEdit.value;
    const updatedPrice = priceEdit.value;

    // Update the product in the array
    products[selectedProductIndex] = {
      productCode: updatedProductCode,
      productName: updatedProductName,
      price: updatedPrice
    };

    // Save updated products to localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Update the table and close the modal
    updateProductTableAdd();
    modalEdit.style.display = 'none';
  }
});

// Handle cancel button in the Edit modal
cancelEditButton.addEventListener('click', () => {
  modalEdit.style.display = 'none';  // Close the modal without saving
});




// === DELETE PRODUCT ===

// Get elements for the Delete modal and the button to open it
const modalDelete = document.getElementById('myModal-delete');
const openModalDeleteButton = document.querySelector('.button.delete');
const closeModalDelete = document.querySelector('.close-delete');
const productSelectDelete = document.getElementById('product-select-delete'); // Dropdown for product selection
const deleteProductButton = document.getElementById('deleteProductButton');

// Open Delete Modal
openModalDeleteButton.addEventListener('click', () => {
  modalDelete.style.display = 'flex';  // Show the Delete modal
  populateDeleteProductDropdown();  // Populate the dropdown with existing products
});

// Close Delete Modal
closeModalDelete.addEventListener('click', () => {
  modalDelete.style.display = 'none';  // Close the Delete modal
});

// Close Delete modal when clicking outside of it
window.addEventListener('click', (event) => {
  if (event.target === modalDelete) {
    modalDelete.style.display = 'none';
  }
});

// Populate the Delete Dropdown
function populateDeleteProductDropdown() {
  productSelectDelete.innerHTML = '<option value="">-- Select a Product --</option>'; // Clear existing options
  products.forEach((product, index) => {
    const option = document.createElement('option');
    option.value = index; // Use index as value
    option.textContent = `${product.productCode} - ${product.productName} (₱${parseFloat(product.price).toFixed(2)})`;
    productSelectDelete.appendChild(option);
  });
}

// Handle deletion of the product
deleteProductButton.addEventListener('click', () => {
  const selectedProductIndex = parseInt(productSelectDelete.value, 10);
  if (selectedProductIndex !== -1) {
    // Delete the product from the array
    products.splice(selectedProductIndex, 1);
    
    // Save updated products list to localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Update the product table
    updateProductTableAdd();

    // Close the Delete modal
    modalDelete.style.display = 'none';
  }
});

// On page load, load products from localStorage
window.addEventListener('load', loadProductsFromLocalStorage);


