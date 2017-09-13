export function mapEvent(eventName: string) : string {
    switch(eventName.toLowerCase()) {
        case 'onclick':
            return 'click';
        default: 
            return 'unknown'
    }
}