const FS_Bloom = () => {
    return "uniform float time_0_X;\n\
    uniform vec4 color;\n\
    uniform sampler3D Noise;\n\
    uniform float glowStrength;\n\
    uniform float height;\n\
    uiform float glowFallOff;\n\
    uniform float speed;\n\
    uniform float sampleDist;\n\
    uniform float ambientGlow;\n\
    uniform float ambientGlowHeightScale;\n\
    uniform float vertNoise\n\
    \n\
    void main(void)\n\
    {\n\
        //vec2 texCoord = vec2(2.* (gl_FragCoord.x - 256.)/ 512., \n\
        //2. * (gl_FragCoord.y - 256.)/ 512.);\n\
        \n\
        vec2 texCoord = vec2(clamp(2. * (gl_FragCoord.x - 256.) / 512., -1., 1.),\n\
            clamp(2. * (gl_FragCoord.y - 256.) / 512., -1., 1.));\n\
        vec2 t = vec2(speed * time_0_X * .5871\n\
            - vertNoise * abs(texCoord.y), speed * time_0_X);\n\
        float xs0 = texCoord.x - sampleDist;\n\
        float xs1 = texCoord.x;\n\
        float xs2 = texCoord.x + sampleDist;\n\
        float noise0 = texture3D(Noise, vec3(xs0, t)).r;\n\
        float noise1 = texture3D(Noise, vec3(xs1, t)).r;\n\
        float noise2 = texture3D(Noise, vec3(xs2, t)).r;\n\
        \n\
        float mid0 = height * (noise0 * 2. - 1.) * (1. - xs0 * xs0);\n\
        float mid1 = height * (noise1 * 2. - 1.) * (1. - xs1 * xs1);\n\
        float mid2 = height * (noise2 * 2. - 1.) * (1. - xs2 * xs2);\n\
        float dist0 = abs(texCoord.y - mid0);\n\
        float dist1 = abs(texCoord.y - mid1);\n\
        float dist2 = abs(texCoord.y - mid2);\n\
        float glow = 1.0 - pow(0.25 * (dist0 + 2. * dist1 + dist2), glowFallOff);\n\
        float ambGlow = ambientGlow * (1. - texCoord.x * texCoord.x)\n\
            * (1.0 - abs(ambientGlowHeightScale * texCoord.y));\n\
            \n\
        //vec4 result = ambGlow * color;\n\
        //vec4 result = glowStrength * glow * glow * color;\n\
        vec4 result = (glowStrength * glow * glow + ambGlow) * color;\n\
        \n\
        gl_FragColor = result;\n\
    }\n\
    "
}

export { FS_Bloom }