import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.config.js";
import pgClient from "../config/pg-client.config.js";

async function getAll() {
    const employees = await pgClient.query("SELECT * FROM employees");
    return employees.rows.map(employee => ({
        id: employee.id,
        firstName: employee.first_name,
        lastName: employee.last_name,
        email: employee.email
    }));
}

async function registration(request, response){
    const { firstName, lastName, email, password } = request.body;
    if (!firstName || !lastName || !email || !password) {
        throw new Error("Missing required employee data");
    }

    const emailExists = await pgClient.query("SELECT * FROM employees WHERE email = $1", [email]);
    if (emailExists.rows.length > 0) {
        throw new Error("Użytkownik został już zarejestrowany");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const employeeResult = await pgClient.query(
        "INSERT INTO employees (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
        [firstName, lastName, email, hashedPassword]
    );

    if (employeeResult.rowCount === 0) {
        throw new Error("Error creating user");
    }

    const employeesResult = await pgClient.query("SELECT * FROM employees");
    const currentEmployee = employeesResult.rows[employeesResult.rows.length - 1]
    return {
        id: currentEmployee.id,
        firstName: currentEmployee.first_name,
        lastName: currentEmployee.last_name,
        email: currentEmployee.email
    };
}

async function login(request, response) {
    const { email, password } = request.body;
    if (!email || !password) {
        throw new Error("Missing required login credentials");
    }

    const employeeResult = await pgClient.query(
        "SELECT * FROM employees WHERE email = $1",
        [email]
    );

    if (employeeResult.rows.length === 0) {
        throw new Error("Invalid email");
    }

    const employee = employeeResult.rows[0];

    const isValidPassword = await bcrypt.compare(password, employee.password);
    if (!isValidPassword) {
        throw new Error("Invalid password");
    }

    const payload = { id: employee.id };
    const token =  jwt.sign(payload, jwtConfig.jwtSecretKey);

    response.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return { message: 'success' };
}

async function logout(request, response) {
    response.cookie('jwt', '', {maxAge: 0});
    return { message: 'success' };
}

async function token(request, response) {
   try {
       const cookie = request.cookies['jwt'];
       const claims = jwt.verify(cookie, jwtConfig.jwtSecretKey);
       if (!claims) {
           throw new Error("Invalid token claims");
       }

       const employeeResult = await pgClient.query("SELECT * FROM employees WHERE id = $1", [claims.id]);
       const employee = employeeResult.rows[0];
       return {
           id: employee.id,
           firstName: employee.first_name,
           lastName: employee.last_name,
           email: employee.email
       };
   } catch(error) {
       throw new Error("Invalid token");
   }
}

async function remove(request, response) {
    const employeeId = request.params.id;
    if (!employeeId) {
        throw new Error("Missing employee ID in request parameter");
    }

    const employeeResult = await pgClient.query("DELETE FROM employees WHERE id = $1", [employeeId]);
    if (employeeResult.rowCount === 0) {
        response.status(404).send("Employee not found");
        return;
    }

    const employees = await pgClient.query("SELECT * FROM employees");
    return employees.rows.map(user => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
    }));
}

export default {
    getAll,
    registration,
    login,
    logout,
    token,
    remove
};