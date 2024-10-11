export const calculateTimeConclusion = (createdAt: string, deletedAt: string): string  => {
  const createdDate = new Date(createdAt);
  const deletedDate = new Date(deletedAt);

  const diffInMs = deletedDate.getTime() - createdDate.getTime();

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const days = Math.floor(diffInSeconds / (3600 * 24));
  const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  if(days >= 1){
    return `${days} dias, ${hours} horas`;
  } else if(hours <= 24 && hours > 0){
    return `${hours} horas, ${minutes} minutos`;
  } else if(minutes <= 60 && minutes > 0){
    return `${minutes} minutos`;
  } else {
    return `${seconds} Segundos`;
  }
}
