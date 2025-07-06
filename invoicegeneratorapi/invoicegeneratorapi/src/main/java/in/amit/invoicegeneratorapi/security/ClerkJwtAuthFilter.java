package in.amit.invoicegeneratorapi.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.amit.invoicegeneratorapi.service.ClerkJwksProvider;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.PublicKey;

import java.util.Base64;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class ClerkJwtAuthFilter extends OncePerRequestFilter {

    @Value("${clerk.issuer}")
    private String clerkIssuer;
    private final ClerkJwksProvider jwksProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
      // todo : implement auth filter
        if(request.getRequestURI().contains("/api/webhooks")){
            filterChain.doFilter(request,response);
            return;
        }
        String authHeader = request.getHeader("Authorization");
        if(authHeader==null || !authHeader.startsWith("Bearer ")){
            response.sendError(HttpServletResponse.SC_FORBIDDEN,"Authorization Header is missing/invalid");
            return;
        }
        try {
            String token = authHeader.substring(7);

            String[] chunks = token.split("\\.");
            String headerJson = new String(Base64.getUrlDecoder().decode(chunks[0]));
            ObjectMapper mapper = new ObjectMapper();
            JsonNode headerNode = mapper.readTree(headerJson);
            String kid = headerNode.get("kid").asText();

            PublicKey publicKey = jwksProvider.getPublicKey(kid);

            Claims claims = Jwts.parserBuilder().setSigningKey(publicKey).setAllowedClockSkewSeconds(60).requireIssuer(clerkIssuer).build().parseClaimsJws(token).getBody();
            String clerkUserID = claims.getSubject();

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(clerkUserID,null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));

            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
        catch (Exception e){
            response.sendError(HttpServletResponse.SC_FORBIDDEN,"Invalid JWT Token");
            return;
        }
        filterChain.doFilter(request,response);
    }
}
