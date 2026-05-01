import React, { useEffect, useState } from 'react';
import { deleteEmployee, listEmployees } from '../services/EmployeeService';
import { useNavigate } from 'react-router-dom';

const ListEmployeeComponent = () => {

    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword);
            setPage(0);
        }, 300);

        return () => clearTimeout(timer);
    }, [keyword]);

    // API Call
    useEffect(() => {
        getAllEmployees(page, debouncedKeyword);
    }, [page, debouncedKeyword]);

    function getAllEmployees(currentPage, searchKey) {

        if (totalElements === 0 && searchKey === "") {
            setLoading(true);
        }

        listEmployees(currentPage, 5, searchKey)
            .then((response) => {

                //  ApiResponse wrapper
                const pageData = response.data.data;

                setEmployees(pageData.content || []);
                setTotalPages(pageData.totalPages || 0);
                setTotalElements(pageData.totalElements || 0);
            })
            .catch(error => {
                console.error(error);
                alert(
                    error.response?.data?.message ||
                    "Failed to load employees."
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function addNewEmployee() {
        navigate('/add-employee');
    }

    function updateEmployee(employee) {

        const loggedInEmail = localStorage.getItem("email");
        const role = localStorage.getItem("role");

        if (role === "ADMIN") {
            navigate(`/edit-employee/${employee.id}`);
            return;
        }

        if (employee.email !== loggedInEmail) {
            alert("Access Denied. You can update only your own record.");
            return;
        }

        navigate(`/edit-employee/${employee.id}`);
    }

    function removeEmployee(id) {

        deleteEmployee(id)
            .then((response) => {

                alert(
                    response.data.message ||
                    "Employee deleted successfully"
                );

                getAllEmployees(page, debouncedKeyword);
            })
            .catch(error => {

                console.error(error);

                // 403 Forbidden
                if (error.response?.status === 403) {
                    alert("Access Denied. Only Admin can delete employees.");
                    return;
                }

                // Backend custom message
                if (error.response?.data?.message) {
                    alert(error.response.data.message);
                    return;
                }

                // 401 Unauthorized
                if (error.response?.status === 401) {
                    alert("Session expired. Please login again.");
                    return;
                }

                // 404
                if (error.response?.status === 404) {
                    alert("Employee not found.");
                    return;
                }

                alert("Delete failed. Please try again.");
            });
    }

    return (
        <div className='container mt-4'>

            <h2 className='text-center mb-4'>
                List of Employees
            </h2>

            {/* Search + Add */}
            <div className='d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2'>

                <input
                    type="text"
                    className="form-control"
                    style={{ maxWidth: "300px" }}
                    placeholder="Search by name or email..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />

                <button
                    className='btn btn-primary'
                    onClick={addNewEmployee}
                >
                    Add Employee
                </button>
            </div>

            {/* Loading */}
            {loading ? (

                <div className="text-center mt-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="mt-2">Loading employees...</p>
                </div>

            ) : employees.length === 0 ? (

                <div className="text-center mt-5">

                    <h3>
                        👋 Welcome to Employee Management System
                    </h3>

                    <p className="mt-3 text-muted">
                        You don’t have employee records.
                    </p>

                    <p className="text-muted">
                        Click the <b>Add Employee</b> button above.
                    </p>

                </div>

            ) : (

                <>
                    {/* Table */}
                    <div className="table-responsive">

                        <table className='table table-striped table-bordered align-middle text-center'>

                            <thead className="table-dark">
                                <tr>
                                    <th>Id</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {employees.map((employee) => (

                                    <tr key={employee.id}>

                                        <td>{employee.id}</td>
                                        <td>{employee.firstName}</td>
                                        <td>{employee.lastName}</td>
                                        <td>{employee.email}</td>

                                        <td>
                                            <div className="d-flex justify-content-center gap-2 flex-wrap">

                                                <button
                                                    className='btn btn-info btn-sm'
                                                    onClick={() => updateEmployee(employee)}
                                                >
                                                    Update
                                                </button>

                                                <button
                                                    className='btn btn-danger btn-sm'
                                                    onClick={() => removeEmployee(employee.id)}
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center mt-3 gap-2">

                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={page === 0}
                            onClick={() => setPage(prev => prev - 1)}
                        >
                            Prev
                        </button>

                        <span className="align-self-center">
                            Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
                        </span>

                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            Next
                        </button>

                    </div>
                </>
            )}

        </div>
    );
};

export default ListEmployeeComponent;