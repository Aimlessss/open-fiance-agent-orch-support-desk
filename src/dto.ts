export type TEngineersDetails = {
    id: string;
    name: string;
    email: string;
    dept : string;
    specialization: string;
};

export type TTicketsTypes = {
    id: string;
    title: string;
    description: string;
    status: "open" | "in_progress" | "closed";
    priority: number
    timestamp: string;
    assignedTo: string; // Engineer ID
};

export type Tickets = Array<TTicketsTypes>;
export type Engineers = Array<TEngineersDetails>;