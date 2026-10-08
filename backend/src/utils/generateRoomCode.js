const CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export default function generateRoomCode(length = 6) {
  let code = "";

  for (let i = 0; i < length; i++) {
    code += CHARACTERS[
      Math.floor(Math.random() * CHARACTERS.length)
    ];
  }

  return code;
}
