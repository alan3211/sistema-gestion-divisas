import { Button } from "react-bootstrap";
import './ticket.css';

export const Ticket = () => {

    const printModalContent = () => {
        const modalContainer = document.getElementById('ticket-preview-modal');
        const modalContent = modalContainer.innerHTML;

        // Crea un elemento temporal para imprimir solo el contenido deseado
        const printWindow = window.open('', '', 'width=600,height=600');
        printWindow.document.open();
        printWindow.document.write('<html><head><title>Ticket</title>');

        printWindow.document.write('</head><body>');
        printWindow.document.write(modalContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        // Espera a que se cargue el contenido antes de imprimir
        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };
    };

    return (
        <>
            <div className="ticket-container" id="ticket-preview-modal">
                {/* ... Otro contenido del ticket ... */}
                <div className="ticket">
                    <h1>Nombre de la Tienda</h1>
                    <p>Fecha: 2023-09-14</p>
                    <p>Productos:</p>
                    <ul>
                        <li>Producto 1: $10.00</li>
                        <li>Producto 2: $15.00</li>
                    </ul>
                    <p>Total: $25.00</p>
                </div>
            </div>
            <Button variant="secondary" onClick={printModalContent}>
                <i className="bi bi-printer-fill me-2"></i>
                Imprimir Ticket
            </Button>
        </>
    );
}
