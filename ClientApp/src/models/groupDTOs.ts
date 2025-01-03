export interface GroupDTO {
  id: number;
<<<<<<< Updated upstream
  code: number;
=======
  code?: number;
>>>>>>> Stashed changes
  name: string;
  description?: string;
  dateCreated: Date;
  dateModified?: Date | null;
  createdBy?: string;
  area?: string;
  division?: string;
}



export interface PagedResult {
  items: GroupDTO[];    // Array of GroupDTO (list of groups)
  totalCount: number;   // Total number of groups
  pageNumber: number;   // Current page number
  pageSize: number;     // Number of groups per page
  searchTerm: string;   // Search term used (if any)
}

export interface GroupCreateDTO {
  code: string,
  name: string,
  area: string,
  division: string

}

export interface GroupUpdateDTO {
  id: number;
  name: string;
  
}


export interface BranchOption {
  brCode: string;
  brName: string;
}