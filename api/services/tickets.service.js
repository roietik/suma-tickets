import pgClient from "../config/pg-client.config.js";

async function getTicketCount(){
    try {
        const tableExistsResult = await pgClient.query(`SELECT 1 FROM information_schema.tables WHERE table_name = 'tickets'`);

        if (!tableExistsResult.rows.length) {
            console.log("Tickets table doesn't exist. Returning false.");
            return String(0);
        }

        const tickets = await pgClient.query("SELECT COUNT(*) FROM tickets");
        return String(tickets.rows[0].count);
    } catch (error) {
        if (error.message.includes("timeout")) {
            console.error("Ticket count query timed out:", error);
            return null;
        } else {
            console.error("Error fetching ticket count:", error);
            throw error;
        }
    }
}

async function getUniqueTicketNumber(){
    return String(Number(await getTicketCount()) + 1);
}

async function getTicketsLimit(){
    try {
        // Check if the 'tickets' table exists
        const tableExistsResult = await pgClient.query(`SELECT 1 FROM information_schema.tables WHERE table_name = 'tickets'`);

        if (!tableExistsResult.rows.length) {
            console.log("Tickets table doesn't exist. Returning false.");
            return String(2147483647);
        }

        const result = await pgClient.query('SELECT ticket_limit FROM tickets_limit LIMIT 1');

        if (result.rows.length === 0) {
            return String(2147483647);
        }

        return String(result.rows[0].ticket_limit);
    } catch (err) {
        console.error('Error fetching ticket limit:', err);
        return null;
    }
}

async function setTicketsLimit(request, response) {
    const { ticketsLimit } = request.body;
    const limit = Number(ticketsLimit);

    if (typeof limit !== 'number' || limit <= 0) {
        throw new Error('Invalid ticket limit. Please provide a positive number.');
    }

    try {
        const result = await pgClient.query('SELECT 1 FROM tickets_limit LIMIT 1');

        if (result.rows.length === 0) {
            await pgClient.query('INSERT INTO tickets_limit (ticket_limit) VALUES ($1)', [limit]);
            console.log('Created new ticket limit entry');
            return;
        }

        await pgClient.query('UPDATE tickets_limit SET ticket_limit = $1', [limit]);
        console.log('Updated existing ticket limit:', limit);
    } catch (err) {
        console.error('Error setting ticket limit:', err);
        response.status(500).send('An error occurred while setting the ticket limit.');
    }
}

async function getTicketsSoldOut(){
    try {
        // Check if the 'tickets' table exists
        const tableExistsResult = await pgClient.query(`SELECT 1 FROM information_schema.tables WHERE table_name = 'tickets'`);

        if (!tableExistsResult.rows.length) {
            console.log("Tickets table doesn't exist. Returning false.");
            return false;
        }

        const result = await pgClient.query('SELECT tickets_sold_out FROM tickets_sold_out LIMIT 1');
        console.log('result1', result);
        if (!result) {
            console.log('result2', result);
            return false;
        }
        if (!result.rows) {
            console.log('result3', result);
            return false;
        }
        if (result.rows.length === 0) {
            console.log('result4', result);
            return false;
        }
        console.log('result5', result);
        console.log('result.row...',  result.rows[0].tickets_sold_out)
        return result.rows[0].tickets_sold_out;
    } catch (err) {
        console.error('Error fetching ticket limit:', err);
        return false;
    }
}

async function setTicketsSoldOut(request, response) {
    const { ticketsSoldOut } = request.body;

    if (typeof ticketsSoldOut !== 'boolean') {
        throw new Error('Invalid ticket soldOut. Please provide a boolean.');
    }

    try {
        const result = await pgClient.query('SELECT 1 FROM tickets_sold_out LIMIT 1');

        if (result.rows.length === 0) {
            await pgClient.query('INSERT INTO tickets_sold_out (tickets_sold_out) VALUES ($1)', [ticketsSoldOut]);
            console.log('Created new ticket soldOut entry');
            return;
        }

        await pgClient.query('UPDATE tickets_sold_out SET tickets_sold_out = $1', [ticketsSoldOut]);
        console.log('Updated existing ticket soldOut:', ticketsSoldOut);
    } catch (err) {
        console.error('Error setting ticket soldOut:', err);
        response.status(500).send('An error occurred while setting the ticket soldOut.');
    }
}

export default {
    getTicketCount,
    getUniqueTicketNumber,
    getTicketsLimit,
    setTicketsLimit,
    getTicketsSoldOut,
    setTicketsSoldOut
};
