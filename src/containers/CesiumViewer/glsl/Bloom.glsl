uniform float time_0_X;
uniform vec4 color;
uniform sampler3D Noise;
 
uniform float glowStrength;
uniform float height;
uniform float glowFallOff;
uniform float speed;
uniform float sampleDist;
uniform float ambientGlow;
uniform float ambientGlowHeightScale;
uniform float vertNoise
 
void main(void)
{
   //vec2 texCoord = vec2(2.* (gl_FragCoord.x - 256.)/ 512., 
   //2. * (gl_FragCoord.y - 256.)/ 512.);
   
   vec2 texCoord = vec2(clamp(2.* (gl_FragCoord.x - 256.)/ 512., -1., 1.), 
   clamp(2.* (gl_FragCoord.y - 256.)/ 512., -1., 1.));
   // 噪声采样的垂直位置
   vec2 t = vec2(speed * time_0_X * .5871 
   - vertNoise * abs(texCoord.y), speed * time_0_X);
 
   // 噪声采样的三个水平位置
   float xs0 = texCoord.x - sampleDist;
   float xs1 = texCoord.x;
   float xs2 = texCoord.x + sampleDist;
   
   // 三次噪声采样
   float noise0 = texture3D(Noise, vec3(xs0, t)).r;
   float noise1 = texture3D(Noise, vec3(xs1, t)).r;
   float noise2 = texture3D(Noise, vec3(xs2, t)).r;
 
   // The position of the flash
   float mid0 = height * (noise0 * 2. - 1.) * (1. - xs0 * xs0);
   float mid1 = height * (noise1 * 2. - 1.) * (1. - xs1 * xs1);
   float mid2 = height * (noise2 * 2. - 1.) * (1. - xs2 * xs2);
 
   // Distance to flash
   float dist0 = abs(texCoord.y - mid0);
   float dist1 = abs(texCoord.y - mid1);
   float dist2 = abs(texCoord.y - mid2);
 
   // Glow according to distance to flash
   float glow = 1.0 - pow(0.25 * (dist0 + 2. * dist1 + dist2), glowFallOff);
 
   // Add some ambient glow to get some power in the air feeling
   float ambGlow = ambientGlow * (1. - texCoord.x * texCoord.x) 
   * (1.0 - abs(ambientGlowHeightScale * texCoord.y));
   
   //vec4 result = ambGlow * color;
   //vec4 result = glowStrength * glow * glow * color;
   vec4 result = (glowStrength * glow * glow + ambGlow) * color;
 
   gl_FragColor = result;
}