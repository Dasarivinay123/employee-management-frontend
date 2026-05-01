import React, { useEffect, useState } from 'react';
import { createEmployee, getEmployee, updateEmployee } from '../services/EmployeeService';
import { useNavigate, useParams } from 'react-router-dom';

const EmployeeComponent = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Load employee for update
  useEffect(() => {
    if (id) {
      setLoading(true);

      getEmployee(id)
        .then((response) => {

          //  ApiResponse wrapper
          const employee = response.data.data;

          setFirstName(employee.firstName);
          setLastName(employee.lastName);
          setEmail(employee.email);
        })
        .catch(error => {
          console.log(error);
          setServerError(
            error.response?.data?.message || "Failed to load employee"
          );
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  function saveOrUpdateEmployee(e) {
    e.preventDefault();
    setServerError('');

    if (validateForm()) {

      const employee = { firstName, lastName, email };
      setLoading(true);

      if (id) {

        // UPDATE
        updateEmployee(id, employee)
          .then((response) => {

            alert(response.data.message || "Employee updated successfully");
            navigate('/employees');

          })
          .catch(error => handleError(error))
          .finally(() => setLoading(false));

      } else {

        // CREATE
        createEmployee(employee)
          .then((response) => {

            alert(response.data.message || "Employee created successfully");
            navigate('/employees');

          })
          .catch(error => handleError(error))
          .finally(() => setLoading(false));
      }
    }
  }

  // Handle backend errors
  function handleError(error) {
    console.error(error);

    if (error.response?.data?.message) {
      setServerError(error.response.data.message);
    } else {
      setServerError("Server error. Please try again.");
    }
  }

  // Validation
  function validateForm() {

    let valid = true;

    const errorsCopy = {
      firstName: '',
      lastName: '',
      email: ''
    };

    if (!firstName.trim()) {
      errorsCopy.firstName = 'First Name is required';
      valid = false;
    }

    if (!lastName.trim()) {
      errorsCopy.lastName = 'Last Name is required';
      valid = false;
    }

    if (!email.trim()) {
      errorsCopy.email = 'Email is required';
      valid = false;
    }

    setErrors(errorsCopy);

    return valid;
  }

  function pageTitle() {
    return id
      ? <h2 className='text-center'>Update Employee</h2>
      : <h2 className='text-center'>Add Employee</h2>;
  }

  // Loading for edit page
  if (loading && id) {
    return (
      <div className='text-center mt-5'>
        <h5>Loading employee...</h5>
      </div>
    );
  }

  return (
    <div className='container'>
      <br /><br /><br />

      <div className='row'>
        <div className='card col-md-6 offset-md-3'>

          {pageTitle()}

          <div className='card-body'>

            {serverError && (
              <div className="alert alert-danger text-center">
                {serverError}
              </div>
            )}

            <form>

              <div className='form-group mb-2'>
                <label className='form-label'>First Name:</label>

                <input
                  type='text'
                  placeholder='Enter First Name'
                  value={firstName}
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  onChange={(e) => setFirstName(e.target.value)}
                />

                {errors.firstName &&
                  <div className='invalid-feedback'>
                    {errors.firstName}
                  </div>
                }
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Last Name:</label>

                <input
                  type='text'
                  placeholder='Enter Last Name'
                  value={lastName}
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  onChange={(e) => setLastName(e.target.value)}
                />

                {errors.lastName &&
                  <div className='invalid-feedback'>
                    {errors.lastName}
                  </div>
                }
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Email:</label>

                <input
                  type='email'
                  placeholder='Enter Email'
                  value={email}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {errors.email &&
                  <div className='invalid-feedback'>
                    {errors.email}
                  </div>
                }
              </div>

              <button
                className='btn btn-success mt-2'
                onClick={saveOrUpdateEmployee}
                disabled={loading}
              >
                {loading ? "Processing..." : "Submit"}
              </button>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeComponent;