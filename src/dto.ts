export type TAttachments = {
    filename : string,
    contentType : string,
    data : string
}
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


export type TIncomingTicketToAgent = {
    id : string,
    title : string,
    priority : 'SEV-1 Critical' | 'SEV-2 Fault' | 'SEV-3 Minor' | 'None',
    textInputs : string,
    attachments? : Array<TAttachments>
}

export type Tickets = Array<TTicketsTypes>;
export type Engineers = Array<TEngineersDetails>;